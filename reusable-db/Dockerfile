FROM mysql:8.0

COPY init/ /docker-entrypoint-initdb.d/

ENV TZ=UTC

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD mysqladmin ping -h localhost -u root -p"${MYSQL_ROOT_PASSWORD}" || exit 1

EXPOSE 3306
