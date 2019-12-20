<template>
  <div class="ativos">
    <h1>Ativos</h1>
    <hr/>

    <b-button v-b-modal.criaAtivos>
        <font-awesome-icon icon="plus"/><span> Adicionar</span>
    </b-button>

    <b-table striped hover :items="ativos" :fields="fields">

      <template slot="cell(actionDelete)" slot-scope="{ item }">
        <b-button v-on:click="excluirAtivo(item)">
          <font-awesome-icon icon="trash"/>
        </b-button>
      </template>

      <template slot="cell(actionEdit)" slot-scope="{ item }">
        <b-button v-on:click="beforeEditaAtivo(item)">
          <font-awesome-icon icon="pen"/>
        </b-button>
      </template>

    </b-table>

    <b-modal id="criaAtivos" 
      title="Novo Ativo"
      ok-title="Salvar"
      cancel-title="Cancelar"
      @show="beforeNovoAtivo"
      @ok="saveNovoAtivo"
      >
      <formAtivos v-model="ativoAtual"/>
    </b-modal>

    <b-modal id="editaAtivo" 
      :title="'Editar ativo - ' + ativoAtual.codigo"
      ok-title="Alterar"
      cancel-title="Cancelar"
      @ok="editarAtivo"
      >
      <formAtivos v-model="ativoAtual"/>
    </b-modal>

  </div>
</template>
<script>

import formAtivos from '../components/FormAtivos'
import axios from 'axios';

export default {
  components: {formAtivos},
  data: () => {
    return {
      ativoAtual:{
        codigo: "",
        descricao: "",
        isNew: true
      },
      ativos: [],
      fields: [
        {
          key: "codigo",
          label: "Código"
        },
        {
          key: "descricao",
          label: "Descrição"
        },
        {
          key: "actionDelete",
          label: ""
        },
        {
          key: "actionEdit",
          label: ""
        }
     ]
    }  
  },
  methods: {
    async excluirAtivo(ativo) {
      try {
        await axios.delete(`http://localhost:3000/ativos/${ativo.codigo}`);
        await this.carregaAtivos();
      } catch(err) {
        alert('erro ao excluir ativo');
      }
    },

    beforeEditaAtivo(ativo) {
      this.ativoAtual = {
        codigo:ativo.codigo,
        descricao:ativo.descricao,
        isNew:false
      };
      this.$root.$emit('bv::show::modal','editaAtivo');
      
    },

    async editarAtivo() {
     let payload = {
        descricao: this.ativoAtual.descricao
      };

      try {
        await axios.put(`http://localhost:3000/ativos/${this.ativoAtual.codigo}`, payload);
        await this.carregaAtivos();
      } catch(err) {
        alert('erro ao atualizar ativo');
      }
    },

    async carregaAtivos() {
      this.ativos.splice(0, this.ativos.length);
      let dados = await axios.get('http://localhost:3000/ativos/');
      this.ativos.push(...dados.data);
    },

    beforeNovoAtivo() {
      this.ativoAtual.codigo = '';
      this.ativoAtual.descricao = '';
      this.ativoAtual.isNew = true;
    },

    async saveNovoAtivo() {
      let payload = {
        codigo: this.ativoAtual.codigo,
        descricao: this.ativoAtual.descricao
      };

      try {
        await axios.post('http://localhost:3000/ativos/', payload);
        await this.carregaAtivos();
      } catch(err) {
        alert('erro ao inserir ativo');
      }
    },
  },
  async mounted() {
    await this.carregaAtivos();
  }
}
</script>