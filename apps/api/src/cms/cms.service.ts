import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as sanitizeHtml from "sanitize-html";
import { PageBlock, PageEntity } from "./entities/page.entity";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pagesRepository: Repository<PageEntity>
  ) {}

  findAll() {
    return this.pagesRepository.find({ order: { updatedAt: "DESC" } });
  }

  async findOne(id: number) {
    const page = await this.pagesRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException("Сторінку не знайдено");
    }
    return page;
  }

  async findPublishedBySlug(slug: string) {
    const page = await this.pagesRepository.findOne({ where: { slug, status: "published" } });
    if (!page) {
      throw new NotFoundException("Сторінку не знайдено");
    }
    return page;
  }

  async create(authorId: number, dto: CreatePageDto) {
    await this.assertSlugFree(dto.slug);
    const page = this.pagesRepository.create({
      ...dto,
      content: this.sanitizeBlocks(dto.content),
      authorId,
    });
    return this.pagesRepository.save(page);
  }

  async update(id: number, dto: UpdatePageDto) {
    const page = await this.findOne(id);
    if (dto.slug && dto.slug !== page.slug) {
      await this.assertSlugFree(dto.slug);
    }
    Object.assign(page, {
      ...dto,
      content: dto.content ? this.sanitizeBlocks(dto.content) : page.content,
    });
    return this.pagesRepository.save(page);
  }

  async remove(id: number) {
    const page = await this.findOne(id);
    await this.pagesRepository.remove(page);
  }

  // Defense in depth: even though only admins author CMS content today,
  // rich-text blocks go through the same sanitization SKILL.md requires for
  // any user-supplied HTML (chat, reviews) — an admin account compromise
  // shouldn't translate directly into stored XSS served to every visitor.
  private sanitizeBlocks(blocks: PageBlock[]): PageBlock[] {
    return blocks.map((block) => {
      if (block.type === "richtext") {
        return { ...block, html: sanitizeHtml(block.html, {
          allowedTags: ["p", "b", "i", "em", "strong", "a", "ul", "ol", "li", "br", "h2", "h3", "blockquote"],
          allowedAttributes: { a: ["href", "target", "rel"] },
        }) };
      }
      return block;
    });
  }

  private async assertSlugFree(slug: string) {
    const existing = await this.pagesRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Сторінка зі slug "${slug}" вже існує`);
    }
  }
}
