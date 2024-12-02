<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    allProductsStore, 
    pageConfigStore, 
    fetchAllProducts, 
    getPaginatedProducts, 
    getTotalPages, 
    type Product 
  } from '../store/productStore';

  let allProducts: Product[] = [];
  let displayedProducts: Product[] = [];
  let isLoading = true;
  let pageSize = 50;
  let currentPage = 1;
  let totalPages = 1;

  // Predefined page size options
  const pageSizeOptions = [25, 50, 100, 200];

  // Subscribe to the store
  allProductsStore.subscribe(value => {
    allProducts = value;
    updatePagination();
  });

  // Subscribe to page config
  pageConfigStore.subscribe(config => {
    pageSize = config.pageSize;
    currentPage = config.currentPage;
    updatePagination();
  });

  function updatePagination() {
    if (allProducts.length > 0) {
      displayedProducts = getPaginatedProducts(allProducts, pageSize, currentPage);
      totalPages = getTotalPages(allProducts.length, pageSize);
      isLoading = false;
    }
  }

  function changePage(newPage: number) {
    if (newPage > 0 && newPage <= totalPages) {
      currentPage = newPage;
      pageConfigStore.update(config => ({ ...config, currentPage: newPage }));
    }
  }

  function changePageSize(newPageSize: number) {
    pageConfigStore.update(config => ({ 
      ...config, 
      pageSize: newPageSize,
      currentPage: 1 // Reset to first page when changing page size
    }));
  }

  onMount(async () => {
    try {
      await fetchAllProducts();
    } catch (error) {
      console.error('Failed to load products', error);
      isLoading = false;
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Product Catalog</h1>
  
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  {:else if allProducts.length === 0}
    <div class="text-center text-gray-500 py-8">
      <p class="text-xl">No products found</p>
    </div>
  {:else}
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-2">
        <span class="text-gray-600">Show:</span>
        <select 
          bind:value={pageSize}
          on:change={() => changePageSize(pageSize)}
          class="border rounded px-2 py-1"
        >
          {#each pageSizeOptions as option}
            <option value={option}>{option} products</option>
          {/each}
        </select>
      </div>
      <div class="text-gray-600">
        Total Products: {allProducts.length}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {#each displayedProducts as product (product.SKU)}
        <div class="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2 truncate">{product.product_name}</h2>
            
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div>
                <span class="font-medium">SKU:</span> 
                <span class="text-gray-500">{product.SKU}</span>
              </div>
              <div>
                <span class="font-medium">Category:</span> 
                <span class="text-gray-500">{product.Category}</span>
              </div>
              <div>
                <span class="font-medium">Brand:</span> 
                <span class="text-gray-500">{product.Brand}</span>
              </div>
              <div>
                <span class="font-medium">Price:</span> 
                <span class="text-green-600 font-bold">
                  {product.Price === 'Cotizar' ? 'Quote Required' : `${product.Price} ${product.Currency}`}
                </span>
              </div>
            </div>

            <div class="flex justify-between items-center mt-4">
              <span class="text-xs text-gray-500">
                Loaded: {product.date_of_load}
              </span>
              
              {#if product.reference_link}
                <a 
                  href={product.reference_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4v2m0 0v2m0-2h2m-2 2h-2m2 8H6v-2h10v2z" />
                  </svg>
                  Price List
                </a>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="flex justify-center items-center space-x-4 mt-6">
      <button 
        on:click={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        class="px-4 py-2 border rounded {currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}"
      >
        Previous
      </button>
      
      <span class="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      
      <button 
        on:click={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        class="px-4 py-2 border rounded {currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}"
      >
        Next
      </button>
    </div>
  {/if}
</div>