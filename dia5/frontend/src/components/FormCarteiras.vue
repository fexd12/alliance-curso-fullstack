<template>
    <b-form>
        <b-form-group
            id="input-codigo"
            label="Codigo"
            label-for="txtCodigo"
            description="Informe o código único dos ativos"
            :disabled="!content.isNew">
            <b-form-input
                id="txtCodigo"
                v-model="content.codigo_ativo"
                type="text"
                required
                placeholder="código dos ativos"
                @input="handleInput" 
                :disabled="!content.isNew"/>
        </b-form-group>
       
        <b-form-group
            id="input-quantidade"
            label="quantidade"
            label-for="txtQuantidade"
            description="Informe a quantidade dos ativos">
            <b-form-input
                id="txtquantidade"
                v-model="content.quantidade"
                type="number"
                required
                placeholder="Quantidade"
                @input="handleInput"/>
        </b-form-group>
        <b-form-group
            id="input-preco"
            label="preco"
            label-for="txtpreco"
            description="Informe o preco dos ativos">
            <b-form-input
                id="txtpreco"
                v-model="content.preco_medio"
                type="number"
                required
                placeholder="Preco"
                @input="handleInput"/>
        </b-form-group>
           
    </b-form>
</template>
<script>
export default {
    props:['value'],
    data () {
        return {
            content: {
                codigo_ativo: this.value.codigo_ativo,
                quantidade: Number(this.value.quantidade),
                preco_medio: Number(this.value.preco_medio),
                isNew: this.value.isNew                

            }
        }
    },
    methods: {
        handleInput () {
            let retorno = {
                codigo_ativo: this.content.codigo_ativo,
                quantidade: Number(this.content.quantidade),
                preco_medio: Number(this.content.preco_medio),
                isNew: this.content.isNew
            };
            this.$emit("input",retorno);     
        }
    }    
}
</script>