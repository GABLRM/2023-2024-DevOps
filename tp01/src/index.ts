import http from "http";

const myServer = http.createServer((req, res) => {
    if (req.url === "/ping" && req.method==="GET")  {
        res.write(JSON.stringify(req.headers));
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
 });

 myServer.listen(process.env.PING_LISTEN_PORT ?? 8080, () => {
    console.log('Server is running on port')
 });