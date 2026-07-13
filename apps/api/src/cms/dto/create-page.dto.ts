import { IsIn, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { IsPageBlockArray } from "./page-block.validator";
import type { PageBlock, PageStatus } from "../entities/page.entity";

export class CreatePageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: "slug must contain only lowercase letters, digits and hyphens" })
  @MaxLength(100)
  slug: string;

  @IsIn(["draft", "published"])
  status: PageStatus;

  @IsPageBlockArray()
  content: PageBlock[];
}
