openssl req \
  -x509 \
  -newkey rsa:4096 \
  -keyout config/certs/dev.key.pem \
  -out config/certs/dev.cert.pem \
  -subj "/C=US/ST=North Carolina/O=Nerv/CN=*.nerv.dev" \
  -reqexts SAN \
  -extensions SAN \
  -config <(cat /usr/local/etc/openssl/openssl.cnf \
      <(printf "\n[SAN]\nsubjectAltName=DNS:nerv.dev,DNS:www.nerv.dev")) \
  -days 3650 \
  -nodes
