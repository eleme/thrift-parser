for js in $(find $(dirname $0) -name '*.js')
do
  if node $js
  then echo "[32;1m[Done][0m [0;1m$js[0m"
  else echo "[31;1m[Fail][0m [0;1m$js[0m"
  fi
done
