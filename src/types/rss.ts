export interface Article {
	title: string;
	link: string;
	pubDate: string;
	description?: string;
}

export interface ParsedFeed {
	title: string;
	articles: Article[];
}
