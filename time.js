class Time {
  constructor(nome, escudo) {
    this.nome = nome;
    this.escudo = escudo;
    this.pontos = 0;
    this.gm = 0;
    this.gs = 0;
    this.saldo = 0;
  }

  fimJogo(timeVisitante, golsMarcados, golsSofridos) {
    if (this.foiEmpaate(golsMarcados, golsSofridos)) {
      this.empate(golsMarcados, golsSofridos);
      timeVisitante.empate(golsMarcados, golsSofridos);
      return;
    }
    if (this.foiVitoria(golsMarcados, golsSofridos)) {
      this.vitoria(golsMarcados, golsSofridos);
      timeVisitante.derrota(golsSofridos, golsMarcados);
      return;
    }
    this.derrota(golsMarcados, golsSofridos);
    timeVisitante.vitoria(golsSofridos, golsMarcados);
    return;
  }

  foiEmpaate(golsMarcados, golsSofridos) {
    return golsMarcados === golsSofridos;
  }

  foiVitoria(golsMarcados, golsSofridos) {
    return golsMarcados > golsSofridos;
  }

  derrota(golsMarcados, golsSofridos) {
    this.atualizarInfo(0, golsMarcados, golsSofridos)
  }
  empate(golsMarcados, golsSofridos) {
    this.atualizarInfo(1, golsMarcados, golsSofridos)
  }
  vitoria(golsMarcados, golsSofridos) {
    this.atualizarInfo(3, golsMarcados, golsSofridos)
  }

  atualizarInfo(pontos, golsMarcados, golsSofridos) {
    this.pontos += pontos;
    this.gm += golsMarcados;
    this.gs += golsSofridos;
    this.saldo += golsMarcados - golsSofridos;
  }


}