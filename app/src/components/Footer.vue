<template>
    <footer class="footer" style="height: 7vh; border-top: 1px solid rgba(0, 0, 0, 0.1); margin-top: 0.5vh">
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
