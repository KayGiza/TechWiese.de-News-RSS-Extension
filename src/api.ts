//import feedparser = require("feedparser");
import * as request from "request";
import FeedParser = require("feedparser");

export interface Feed {
    title: string;
    description: string;
    summary: string;
    date: Date;
    pubdate: Date;
    link: string;
    categories: string[];
    image: {
        url: string;
        title: string;
    };
    language: string;
}


export async function getFeed(address: string): Promise<Feed[]> {
    return new Promise<Feed[]>((resolve, reject) => {
        
        let feeds: Feed[] = [];
        let reqStream = request(address);
        let parserStream = new FeedParser();
        
        reqStream.on('error', reject);
        reqStream.on('response', (res: any) => {
            if (res.statusCode !== 200)
                reqStream.emit('error', new Error('Bad status code'));
                
            reqStream.pipe(parserStream);
        })
        
        parserStream.on('error', reject);
        parserStream.on('readable', () => {
            let meta: any = parserStream.meta;
            
            let item: any = null;
            while (item = parserStream.read()) {               
                feeds.push({
                    title: item.title,
                    description: item.description,
                    summary: item.summary,
                    date: new Date(item.date),
                    pubdate: new Date(item.pubdate),
                    link: item.link,
                    categories: item.categories,
                    image: item.image,
                    language: item.language
                });
            }
        });
        
        parserStream.on("end", () => {
            resolve(feeds);
        });
        
    });
}