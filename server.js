const http = require('http'),
      url=require('url'),
      fs = require('fs');

http.createServer((request,response) => {
    let addr = request.url;
    q=url.parse(addr,true);
    filepath='';
    if(q.pathname.include('documentation.html')){
        filepath=(__dirname + '/documentation.html');
    }
    else
    {
        filepath='index.html';
    }
    fs.appendFile('log.txt','URL: ' + addr +'ßnTimestamp' + New Date() + '\n\n', (err) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log('Added to log');
        }
    })
}).listen(8080);

