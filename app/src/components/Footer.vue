<template>
    <footer>
        <div class="text-center p-3">
            Copyright &copy; 
            <span v-if="year == 2021">2021</span>
            <span v-else>2021 - {{ year }}</span> 
            Crypto Market - Todos los derechos reservados.
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            year: new Date().getFullYear()
        }
    }
}
</script>
