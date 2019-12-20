<template>
  <div class="ativos">
    <h1>Performance</h1>
    <hr/>

    <b-table striped hover :items="ativos" :fields="fields"></b-table>
  </div>
</template>
<script>

import axios from 'axios';

export default {
  
  data: () => {
    return {
      ativoAtual:{
        codigo: "",
        descricao: "",
        ID:"",
        codigo_ativo:"",
        tipo:"",
        data:"",
        preco:"",
        quantidade:"",
        lucro_prejuizo:""
      },
      ativos: [],
      fields: [
        {
          key: "codigo_ativo",
          label: "Código"
        },
        {
          key: "tipo",
          label: "tipo"
        },{
            key:"data",
            label:"data"
        },{
            key:"preco",
            label:"preco"
        },{
            key:"quantidade",
            label:"quantidade"

        },{
            key:"lucro_prejuizo",
            label:"Lucro / Prejuizo"
        }
     ]
    }  
  },
  methods: {
    async carregaAtivos() {
      this.ativos.splice(0, this.ativos.length);
      let dados = await axios.get('http://localhost:3000/performance/');
      this.ativos.push(...dados.data);
    }
  },
  async mounted() {
    await this.carregaAtivos();
  }
}
</script>