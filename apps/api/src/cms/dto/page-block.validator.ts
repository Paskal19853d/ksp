import { registerDecorator, ValidationOptions } from "class-validator";
import type { PageBlock } from "../entities/page.entity";

function isValidBlock(block: unknown): block is PageBlock {
  if (typeof block !== "object" || block === null) return false;
  const b = block as Record<string, unknown>;
  if (b.type === "heading") return typeof b.text === "string" && b.text.length > 0 && b.text.length <= 200;
  if (b.type === "richtext") return typeof b.html === "string" && b.html.length <= 20000;
  if (b.type === "image") {
    return (
      typeof b.url === "string" &&
      b.url.length > 0 &&
      b.url.length <= 2000 &&
      typeof b.alt === "string" &&
      b.alt.length <= 200
    );
  }
  return false;
}

export function IsPageBlockArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isPageBlockArray",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return Array.isArray(value) && value.length <= 100 && value.every(isValidBlock);
        },
        defaultMessage() {
          return "content must be an array of valid blocks ({type:'heading',text}, {type:'richtext',html}, {type:'image',url,alt}), max 100 blocks";
        },
      },
    });
  };
}
