export class ReviewNotFoundError extends Error {
  constructor() {
    super("La revisión ya no está disponible");
    this.name = "ReviewNotFoundError";
  }
}

export class ReviewInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewInvalidError";
  }
}

export class ReviewConflictError extends Error {
  constructor() {
    super("El modelo cambió desde que se preparó la revisión; actualiza antes de compartir");
    this.name = "ReviewConflictError";
  }
}
