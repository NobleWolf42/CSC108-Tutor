#define CPPHTTPLIB_OPENSSL_SUPPORT
#include "httplib.h"
#include "query.h"
#include <iostream>

int main()
{
    int port = 3006;
    httplib::SSLServer svr("../cert.pem", "../key.pem");

    svr.Options("/(.*)", [&](const httplib::Request &req, httplib::Response &res)
                {   res.set_header("Access-Control-Allow-Origin", "https://bencarpenterit.com");
                    res.set_header("Access-Control-Allow-Methods", "*");
                    res.set_header("Access-Control-Allow-Headers", "*");
                    res.set_header("Connection", "close"); });

    svr.Post("/questions", [](const httplib::Request &req, httplib::Response &res)
             {
                std::string usrMsg = req.get_header_value("usermsg");
                std::string usrCode = req.body;
                std::cout << "Question: " << usrMsg << std::endl << std::endl;
                std::cout << "Code: " << usrCode << std::endl << std::endl;
                res.set_header("Access-Control-Allow-Origin", "https://bencarpenterit.com");
                res.set_content(queryOllama(usrMsg, usrCode), "text/plain"); });

    svr.Get("/hello", [](const httplib::Request &req, httplib::Response &res)
            { res.set_content("Hello World!", "text/plain"); });

    /* Testing stuff here
    svr.Get("/", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("index.html"); });

    svr.Get("/ai.js", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("ai.js"); });

    svr.Get("/animations.js", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("animations.js"); });

    svr.Get("/style.css", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("style.css"); });
    */

    std::cout << "Server started on port " << port << std::endl;
    svr.listen("0.0.0.0", port);

    return 0;
}