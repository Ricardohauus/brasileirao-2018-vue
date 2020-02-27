Vue.filter('ucwords',
  function (valor) {
    return valor.charAt(0).toUpperCase() + valor.slice(1)
  })

Vue.component('titulo', {
  template: `
  <div class="row ">
  <h3>Campeonato Brasileiro - Série A - 2018</h3>
  </div>
  `
})

Vue.component('clube', {
  props: ['time', 'invertido'],
  template: `
  <div style="display: flex; flex-direction: row">
      <img :src="time.escudo" alt="" class="escudo" :style="{order: invertido == 'true'? 2 : 1}">
      <span :style="{order: invertido == 'true'? 1 : 2}">{{time.nome | ucwords}}</span>
  </div>
  `
});

Vue.component('clubes-libertadores', {
  props: ['times'],
  template: `
  <div>
    <h3>
      Times Classificados para Libertadores
    </h3>
      <ul>
        <li v-for="time in timesLibertadores">
          <clube :time="time"> </clube>
        </li>
      </ul>
  </div>`,
  computed: {
    timesLibertadores() {
      return this.times.slice(0, 6);
    }
  }
})

Vue.component('clubes-rebaixados', {
  props: ['times'],
  template: `
  <div>
    <h3>
    Times Rebaixados
    </h3>
      <ul>
        <li v-for="time in timesRebaixados">
          <clube :time="time"> </clube>
        </li>
      </ul>
  </div>`,
  computed: {
    timesRebaixados() {
      return this.times.slice(16, 20)
    }
  }
})

Vue.component('tabela-clubes', {
  props: ['times'],
  data() {
    return {
      busca: '',
      ordem: {
        colunas: ['pontos', 'gm', 'gs', 'saldo'],
        sort: ['desc', 'desc', 'asc', 'desc']
      },
    }
  },
  template: `<div>  
  <input type="text" class="form-control" v-model="busca">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Nome</th>
        <th v-for="(coluna, indice) in ordem.colunas">
          <a href="#" @click.prevent="ordenar(indice)">
            {{coluna | ucwords}}
          </a>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(time,indice) in timesFiltrados" :class="{'table-success': indice<6 }"
        :style="{'font-size': indice <6 ? '17px' : '15px'}">
        <td>
          <clube :time="time"> </clube>
        </td>
        <td>{{time.pontos}}</td>
        <td>{{time.gm}}</td>
        <td>{{time.gs}}</td>
        <td>{{time.saldo}}</td>
      </tr>
    </tbody>
  </table>
  <clubes-libertadores :times="timesOrdenados"></clubes-libertadores>
  <clubes-rebaixados :times="timesOrdenados"></clubes-rebaixados>
  </div>
  `,
  computed: {
    timesFiltrados() {
      var self = this;
      return _.filter(this.timesOrdenados, function (time) {
        var busca = self.busca.toLowerCase();
        return time.nome.toLowerCase().indexOf(busca) >= 0;
      })
    },
    timesOrdenados() {
      return _.orderBy(this.times, this.ordem.colunas, this.ordem.sort)
    }
  },
  methods: {
    ordenar(indice) {
      this.$set(this.ordem.sort, indice, this.ordem.sort[indice] == 'desc' ? 'asc' : 'desc')
    }
  }
})

Vue.component('novo-jogo', {
  props: ['timeCasa', 'timeFora'],
  data() {
    return {
      golsCasa: 0,
      golsFora: 0
    }
  },
  template: `
  <div>
    <form class="form-inline">      
    <input type="number" class="form-control" v-model="golsCasa">
      <clube :time="timeCasa" invertido="true" v-if="timeCasa"> </clube>      
    <span>X</span>
      <clube :time="timeFora" v-if="timeFora"> </clube>
    <input type="number" class="form-control" v-model="golsFora">
      <button type="button" class="btn btn-primary" @click="fimJogo">
        Fim de Jogo
      </button>
    </form>
  </div>
  `
  , methods: {
    fimJogo() {
      var golsMarcados = parseInt(this.golsCasa);
      var golsSofridos = parseInt(this.golsFora);
      this.timeCasa.fimJogo(this.timeFora, golsMarcados, golsSofridos);
      this.$emit('fim-jogo');
    },
  }
})

new Vue({
  el: '#app',
  data: {
    gols: 3,
    time: new Time('América MG', 'assets/america_mg_60x60.png'),
    times: [
      new Time('palmeiras', 'assets/palmeiras_60x60.png'),
      new Time('Internacional', 'assets/internacional_60x60.png'),
      new Time('Flamengo', 'assets/flamengo_60x60.png'),
      new Time('Atlético-MG', 'assets/atletico_mg_60x60.png'),
      new Time('Santos', 'assets/santos_60x60.png'),
      new Time('Botafogo', 'assets/botafogo_60x60.png'),
      new Time('Atlético-PR', 'assets/atletico-pr_60x60.png'),
      new Time('Corinthians', 'assets/corinthians_60x60.png'),
      new Time('Grêmio', 'assets/gremio_60x60.png'),
      new Time('Fluminense', 'assets/fluminense_60x60.png'),
      new Time('Bahia', 'assets/bahia_60x60.png'),
      new Time('Chapecoense', 'assets/chapecoense_60x60.png'),
      new Time('São Paulo', 'assets/sao_paulo_60x60.png'),
      new Time('Cruzeiro', 'assets/cruzeiro_60x60.png'),
      new Time('Sport', 'assets/sport_60x60.png'),
      new Time('Ceará', 'assets/ceara_60x60.png'),
      new Time('Vitória', 'assets/vitoria_60x60.png'),
      new Time('Vasco', 'assets/vasco_60x60.png'),
      new Time('América-MG', 'assets/america_mg_60x60.png'),
      new Time('Paraná', 'assets/parana_60x60.png'),
    ],
    timeCasa: null,
    timeFora: null,
    visao: 'tabela'
  },
  methods: {
    criarNovoJogo() {
      var indiceCasa = Math.floor(Math.random() * 20),
        indiceFora = Math.floor(Math.random() * 20);
      this.timeCasa = this.times[indiceCasa];
      this.timeFora = this.times[indiceFora];
      this.visao = 'placar';

    },
    showTabela() {
      this.visao = 'tabela'
    }
  },
  filters: {
    saldo(time) {
      return time.gm - time.gs;
    }
  }
})