class Launcher {
  constructor(sid = "-1") {
    this.sid = sid;
    this.status = Array.from(
      { length: 19 },
      (_, i) => new TubeStatus(i + 1)
    );
  }
}
