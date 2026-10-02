FROM oven/bun:1.3 AS construccion
WORKDIR /src/app
COPY app/package.json app/bun.lock app/bunfig.toml ./
RUN bun --no-env-file install --frozen-lockfile
COPY app/ ./
ARG OPFORJA_VERSION=local
ENV OPFORJA_VERSION=$OPFORJA_VERSION
RUN bun --no-env-file run build

FROM oven/bun:1.3-slim
WORKDIR /opt/opforja
COPY --from=construccion /src/app/dist ./web
COPY --from=construccion /src/app/dist-servidor ./servidor
ARG OPFORJA_VERSION=local
ENV OPFORJA_DATOS=/datos OPFORJA_WEB=/opt/opforja/web PORT=8080 NODE_ENV=production OPFORJA_VERSION=$OPFORJA_VERSION
RUN mkdir -p /datos && chown bun:bun /datos
USER bun
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD bun --no-env-file -e "fetch('http://127.0.0.1:8080/salud').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["bun", "--no-env-file", "servidor/principal.js"]
