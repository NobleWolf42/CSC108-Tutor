#include <iostream>
#include "query.h"

int main()
{

    // vecdb globals
    std::vector<std::pair<std::string, std::string>> docsVec;
    unum::usearch::metric_punned_t metric(3, unum::usearch::metric_kind_t::l2sq_k, unum::usearch::scalar_kind_t::f32_k);
    unum::usearch::index_dense_t index = unum::usearch::index_dense_t::make(metric);

    loopDocs("../data", docsVec, index);

    std::cout << "Response from Ollama: " << queryOllama("The programmer on the left intentionally inserted a newline, Why?", "test", docsVec, index) << std::endl;
    return 0;
}
