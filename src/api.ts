//import feedparser = require("feedparser");
import * as request from "request";
import FeedParser = require("feedparser");

export interface Feed {
    title: string;
}


export async function getFeed(address: string): Promise<Feed[]> {
    return new Promise<Feed[]>((resolve, reject) => {
        
        let feeds: Feed[] = [];
        let reqStream = request(address);
        let parserStream = new FeedParser();
        
        reqStream.on('error', reject);
        reqStream.on('response', (res) => {
            if (res.statusCode !== 200)
                reqStream.emit('error', new Error('Bad status code'));
                
            reqStream.pipe(parserStream);
        })
        
        parserStream.on('error', reject);
        parserStream.on('readable', () => {
            let meta: any = parserStream.meta;
            
            console.log("Meta: " + JSON.stringify(meta, null, 2));
            let item: any = null;
            while (item = parserStream.read()) {
                console.log(JSON.stringify(item, null, 2));
                
                feeds.push({
                    title: "test"
                });
            }
        });
        
        parserStream.on("end", () => {
            resolve(feeds);
        });
        
    });
}