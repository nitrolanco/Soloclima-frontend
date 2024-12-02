  
<script lang="ts">
  import ProductList from '../components/ProductList.svelte';

  // Define the Product interface
  interface Product {
    id: number;
    name: string;
    price: number;
  }

  // Sample product data to pass to the ProductList component
  let products: Product[] = [
    { id: 1, name: 'Product 1', price: 29.99 },
    { id: 2, name: 'Product 2', price: 39.99 },
    { id: 3, name: 'Product 3', price: 49.99 },
  ];
</script>

<main>
  <ProductList {products} />
</main>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>