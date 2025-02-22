#include "httplib.h"
#include <iostream>

int main()
{
    httplib::Server svr;

    svr.Get("/hello", [](const httplib::Request &req, httplib::Response &res)
            {
                if (req.has_header("usermsg")) {
                    std::cout << req.get_header_value("usermsg") << std::endl;
                  }
                res.set_content("Hello, World!", "text/plain"); });

    svr.Get("/", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("index.html"); });

    svr.Get("/ai.js", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("ai.js"); });

    svr.Get("/animations.js", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("animations.js"); });

    svr.Get("/style.css", [](const httplib::Request &req, httplib::Response &res)
            { res.set_file_content("style.css"); });

    std::cout << "Server started on port 3006" << std::endl;
    svr.listen("0.0.0.0", 3006);

    return 0;
}