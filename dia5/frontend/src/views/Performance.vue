<template>
  <div class="ativos">
    <h1>Performance</h1>
    <hr/>
    <b-table striped hover :items="ativos" :fields="fields"></b-table>
    <b-row>
        <b-col sm="8">Total Calculado</b-col>
        <b-col v-model="somatudo" :class="somatudo >= 0 ? 'text-success' : 'text-danger'">{{ somatudo }} </b-col>
    </b-row>
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

  },
  computed:{
    somatudo(){
      let total=0;
      for (let linha of this.ativos) {
          total += Number(linha.lucro_prejuizo);
      }
      return Number(total);
    }
  }
}
</script>