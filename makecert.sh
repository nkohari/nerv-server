openssl req \
  -x509 \
  -newkey rsa:4096 \
  -keyout config/certs/dev.key.pem \
  -out config/certs/dev.cert.pem \
  -subj "/C=US/ST=North Carolina/O=Mineboss/CN=*.mineboss.dev" \
  -reqexts SAN \
  -extensions SAN \
  -config <(cat /usr/local/etc/openssl/openssl.cnf \
      <(printf "\n[SAN]\nsubjectAltName=DNS:mineboss.dev,DNS:www.mineboss.dev")) \
  -days 3650 \
  -nodes
