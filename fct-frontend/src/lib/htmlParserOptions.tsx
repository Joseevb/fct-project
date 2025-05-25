import parse, {
	HTMLReactParserOptions,
	DOMNode,
	Element,
} from "html-react-parser";
import { ReactElement } from "react";
import { domToReact } from "html-react-parser";
import { TypographyList, TypographyP } from "@/components/ui/typography";

export function renderHTML(htmlString: string) {
	const options: HTMLReactParserOptions = {
		replace: (domNode: DOMNode): ReactElement | undefined => {
			if (domNode.type !== "tag") return;

			const el = domNode as Element;
			const children = domToReact(el.children as DOMNode[], options);

			switch (el.name) {
				case "p":
					return <TypographyP>{children}</TypographyP>;

				case "ul":
					return <TypographyList>{children}</TypographyList>;

				case "li":
					return <li>{children}</li>;

				default:
					return;
			}
		},
	};

	return parse(htmlString, options);
}
