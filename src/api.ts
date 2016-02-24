//import feedparser = require("feedparser");
import * as request from "request";

export interface Feed {
    title: string;
    author: string;
    link: string;
    content: string;
}

export async function getFeedData(address: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        request(address, (err: any, res: any, body: any) => {
            if(err) {
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

export async function getFeed(address: string): Promise<Feed> {
    
    let data = await getFeedData(address);
    
    return new Promise<Feed>(
        (resolve, reject) => {
            resolve(null);
        }
    );
}