#define CPPHTTPLIB_OPENSSL_SUPPORT
#include "query.h"
#include <sstream>
#include <fstream>

int main()
{
    std::ifstream inputFS;
    std::string jdUsr, jdKey;
    int port;

    inputFS.open("setting.config");
    inputFS >> port;
    inputFS >> jdUsr;
    inputFS >> jdKey;
    inputFS.close();

    httplib::SSLServer svr("cert.pem", "key.pem");
    httplib::Client cli("https://api.jdoodle.com");

    svr.Options("/(.*)", [&](const httplib::Request &req, httplib::Response &res)
                {  
        res.set_header("Access-Control-Allow-Origin", "https://bencarpenterit.com");
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

    svr.Post("/code", [&](const httplib::Request &req, httplib::Response &res)
             {
                std::string usrInput = req.get_header_value("userinput");
                std::string usrCode = req.body;
                std::string jsonBody = "{\"clientId\": \"" + jdUsr + "\",\"clientSecret\": \"" + jdKey + "\",\"script\": \"" + usrCode + "\",\"stdin\":\"" + usrInput + "\",\"language\": \"cpp\",\"versionIndex\": \"0\"}";
                std::cout << "Code: " << usrCode << std::endl << std::endl;
                std::cout << "User Input: " << usrInput << std::endl << std::endl;
                res.set_header("Access-Control-Allow-Origin", "https://bencarpenterit.com");
                auto results = cli.Post("/v1/execute", jsonBody, "application/json");
                std::cout << "Results: " << results->body << std::endl << std::endl;
                res.set_content(results->body, "application/json"); });

    std::cout << "Server started on port " << port << std::endl;
    svr.listen("0.0.0.0", port);

    return 0;
}