#define CPPHTTPLIB_OPENSSL_SUPPORT
#include "httplib.h"
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

    svr.Get("/hello", [](const httplib::Request &req, httplib::Response &res)
            {
                if (req.has_header("usermsg")) {
                    std::cout << req.get_header_value("usermsg") << std::endl;
                }
                res.set_header("Access-Control-Allow-Origin", "https://bencarpenterit.com");
                res.set_content("Hello, World!", "text/plain"); });

    // Testing stuff here
    svr.Get("/", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("index.html"); });

    svr.Get("/ai.js", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("ai.js"); });

    svr.Get("/animations.js", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("animations.js"); });

    svr.Get("/style.css", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("style.css"); });
    // to here

    std::cout << "Server started on port " << port << std::endl;
    svr.listen("0.0.0.0", port);

    return 0;
}