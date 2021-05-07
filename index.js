const cheerio = require("cheerio");
const request=require("request-promise")
const fs = require("fs");
const json2csv=require("json2csv").Parser;

const movies=["https://www.imdb.com/title/tt0419058/?ref_=nv_sr_srsg_0",
"https://www.imdb.com/title/tt6473300/?ref_=fn_al_tt_1",
"https://www.imdb.com/title/tt0831387/?ref_=fn_al_tt_1",
"https://www.imdb.com/title/tt0454921/?ref_=tt_sims_tt",
"https://www.imdb.com/title/tt0109830/?ref_=fn_al_tt_1",
"https://www.imdb.com/title/tt7430722/?ref_=fn_al_tt_2",
"https://www.imdb.com/title/tt4574334/?ref_=fn_al_tt_1",
"https://www.imdb.com/title/tt0234000/?ref_=fn_al_tt_1",
"https://www.imdb.com/title/tt0248126/?ref_=fn_al_tt_1",
"https://www.imdb.com/title/tt0110076/?ref_=nv_sr_srsg_0",
"https://www.imdb.com/title/tt0105599/?ref_=fn_al_tt_1",
];
(async() => {
    let imdbData=[]
    for(let movie of movies){
        const response = await request({
            uri: movie,
            headers:{
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9,en-IN;q=0.8,hi;q=0.7"
            },
            gzip: true
        });
        let $ = cheerio.load(response);
        let Title = $('div[class="title_wrapper"]> h1').text().trim()
        let Rating = $('div[class="ratingValue"]>strong >span').text()
        let Summary =$('div[class="summary_text ready"]>div>div>div>div').text().trim()
        let ReleaseDate= $('a[title="See more release dates"]').text().trim()
    
        imdbData.push({
          Title,Rating,Summary,ReleaseDate,
        });
    }
    const j2cp = new json2csv();
    const csv=j2cp.parse(imdbData);
    fs.writeFileSync("./imdb.csv",csv,"utf-8");
}
)();