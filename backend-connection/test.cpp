#include <iostream>
#include "query.h"

int main()
{

    // vecdb globals
    std::vector<std::pair<std::string, std::string>> docsVec;
    unum::usearch::metric_punned_t metric(3, unum::usearch::metric_kind_t::l2sq_k, unum::usearch::scalar_kind_t::f32_k);
    unum::usearch::index_dense_t index = unum::usearch::index_dense_t::make(metric);

    loopDocs("../data", docsVec, index);

    std::cout << "Response from Ollama: " << queryOllama("On the right, why did the \"Reminder...\" text appear on the same line as the separator text \"------\"?", "test", docsVec, index) << std::endl;
    return 0; /*
     unum::usearch::metric_punned_t metric(3, unum::usearch::metric_kind_t::l2sq_k, unum::usearch::scalar_kind_t::f32_k);

     // If you plan to store more than 4 Billion entries - use `index_dense_big_t`.
     // Or directly instantiate the template variant you need - `index_dense_gt<vector_key_t, internal_id_t>`.
     unum::usearch::index_dense_t index = unum::usearch::index_dense_t::make(metric);
     float vec[3] = {0.1, 0.3, 0.2};

     index.reserve(10);      // Pre-allocate memory for 10 vectors
     index.add(42, &vec[0]); // Pass a key and a vector
     index.add(43, &vec[0]);
     index.add(44, &vec[0]);
     auto results = index.search(&vec[0], 5); // Pass a query and limit number of results

     for (std::size_t i = 0; i != results.size(); ++i)
         // You can access the following properties of every match:
         // results[i].element.key, results[i].element.vector, results[i].distance;
         std::printf("Found matching key: %zu", results[i].member.slot);
     return 0;*/
}
