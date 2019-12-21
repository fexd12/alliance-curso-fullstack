<template>
    <b-form>
        <b-form-group>
            <b-table striped hover :items="ativos" :fields="fields"></b-table>
        </b-form-group>
    </b-form>
</template>

<script>
import axios from 'axios'
export default {
    props:['value'],
    data () {
        return { content: {
                codigo_ativo: this.value.codigo_ativo,
                quantidade: Number(this.value.quantidade),
                preco: Number(this.value.preco),
                isNew: this.value.isNew                

            },
      fields: [
        {
          key: "codigo_ativo",
          label: "Código"
        },
        {
          key:"quantidade",
          label:"Quantidade"
        },
        {
          key:"preco",
          label:"Preco Medio"
        },
        {   
          key: "tipo",
          label: "tipo"
        },
        {
          key: "lucro_prejuizo",
          label: "lucro_prejuizo"
        },
     ]
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
        },
         async historico(){
      this.ativos.splice(0, this.ativos.length);
      let dados = await axios.get(`http://localhost:3000/${this.ativos.codigo_ativo}`);
      this.ativos.push(...dados.data);
      await this.carregaAtivos();
    }
    
    },
    async mounted(){
        await this.historico();
    }
    
   
}

</script>