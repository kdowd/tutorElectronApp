## Subresource Integrity

If you are loading Highlight.js via CDN you may wish to use [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) to guarantee that you are using a legimitate build of the library.

To do this you simply need to add the `integrity` attribute for each JavaScript file you download via CDN. These digests are used by the browser to confirm the files downloaded have not been modified.

```html
<script
  src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"
  integrity="sha384-5xdYoZ0Lt6Jw8GFfRP91J0jaOVUq7DGI1J5wIyNi0D+eHVdfUwHR4gW6kPsw489E"></script>
<!-- including any other grammars you might need to load -->
<script
  src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/go.min.js"
  integrity="sha384-HdearVH8cyfzwBIQOjL/6dSEmZxQ5rJRezN7spps8E7iu+R6utS8c2ab0AgBNFfH"></script>
```

The full list of digests for every file can be found below.

### Digests

```
sha384-xhohaHGp8S443Qn4JZUYAcKqIIl0bQkFA79EUxpbX8GWb5oufdvvSI9ipl/Dasev /es/languages/c.js
sha384-xaTVEdq02jgKStoYDcZD8NhTN1XV/TWpIu4OM53MtMiLl08+e9YJNENo+R/6Nwp0 /es/languages/c.min.js
sha384-rFCBWxbZHxZD51qKR2cdayIcKUSHS3p1PWPIs1kjgsP7lu9ZP32ah/2DoQUm/rTg /es/languages/cpp.js
sha384-+1Koxl0St78gEZW5CpFK+dbLp7yNsfwLzzQUsSGimV4k/RVJUz6YvqtsqtdbJyKf /es/languages/cpp.min.js
sha384-Gmvct15f4Mo9AXQG5bk5w78N1YjBLXXU3KIV7no+mOVnApXlwfw1dwjfueAwljIV /es/languages/css.js
sha384-1D7DbOic0Z5nM2ldSO9O/EsBfsg/5x7X7So1qnMgscI2ucDevptcg7cTvrD9rL0D /es/languages/css.min.js
sha384-uC39e4pRTIrenlpo9NQf2taOPhdRJNaZLFASSg+Q8BLjYqLXvxL8brjzQmJEQ0qn /es/languages/http.js
sha384-36ZwsK42N/jk3DquJeJr/r/oziBOtUxBcg0ZdTaaEDX+Zo/UMgBP4S2Sf4NEyq1y /es/languages/http.min.js
sha384-g7t9fKR5Tvod4iWv7BQXN+/JMn5GT9sD6FG3h7Fgl+KCv5k4NnnCzEqUe7BMJ9Mv /es/languages/javascript.js
sha384-f7huPivS1dV2T5V+g0aJpgsY7WBHWCsioIq30tpNoXGizD65fWJYGuXXVPNI52VB /es/languages/javascript.min.js
sha384-8CRS96Xb/ZkZlQU+5ffA03XTN6/xY40QAnsXKB0Y+ow1vza1LAkRNPSrZqGSNo53 /es/languages/json.js
sha384-UHzaYxI/rAo84TEK3WlG15gVfPk49XKax76Ccn9qPWYbUxePCEHxjGkV+xp9HcS/ /es/languages/json.min.js
sha384-+KkqXkoHKtuOmUzhZ0BjyV0qjljnS+z6i4fELMEg5brFPtmDIog4zZMhylaBTsVi /es/languages/markdown.js
sha384-E7UvgBH6skA1FIOcn3B2c68GtJzrmZlOOC5p/fsxwihTZG/bBedJZu5PC1+kGX7q /es/languages/markdown.min.js
sha384-Qin+c4lNK1aBTVV9uViy9uCeqaw3milnNPTq/TTWClWsc7ZBMi3kDc4d702bPhbf /es/languages/php-template.js
sha384-/Btu11Y1N5hp8EDB6nZJCif5GWMrSC/bYMh0Re/SH64ZoH2qZRHUtqv1SFRPbNdM /es/languages/php-template.min.js
sha384-R67rULqIohpEyV6aFbjxRv7xhK8v/KteX4cvOFmPcnZ2MTf65Zua+2DzB9MqqXuO /es/languages/scss.js
sha384-WMy5VYgOMFAnHhPJXVDCQ/Y/QPlUrBqNVPtFH6/gGg2F4uaAowyQ0y/9zWEeGpJe /es/languages/scss.min.js
sha384-s1ZfN6xtlNKAZux8QYAG7upUsit3RwK5XDoCAN3g6Kj33RrIqbmkuGjdNF9RvzPM /es/languages/sql.js
sha384-y25cn06synxhYnlKVprZdpakuFWVrm2jvn8pqiF4L85a05CI/6bNeT2+qXbUYIyW /es/languages/sql.min.js
sha384-Z61gsCS2W7Q+3fT1fdya/Sz4wlmsotT9iEGzgIlNqP0soaKH1NzysutxWp08Hh3E /es/languages/typescript.js
sha384-Tv4mr9B7b+x2IynRXW/xcAxUj1+AoN9zyp0n9BWE1Nle3Zfm/zUeEztNLhIRjgE7 /es/languages/typescript.min.js
sha384-lAz0Eyld5DmFJB7cxaZonrkUJzGefh+K3niV5d7+vzzS7/P7FEeCJeLNXzMjeo+N /languages/c.js
sha384-tMmX0hBMZeMrZhX6dUNxA94/DNJLl70ao6qu2N9+b/6Ep9Y2e1pBzVjxtLygIB+d /languages/c.min.js
sha384-Z5Ja/rxBluJ4iPYwJYn2numfw2XFmlp3qLL1aJ1SZqyTjKWwMh9yWfpNCOqf3vAm /languages/cpp.js
sha384-B711MHXDqRvH/pKkxJk84RyRt9g0qyAJFsu2XukZKoCdnEiBmA6Aq9fO23ZCS7qk /languages/cpp.min.js
sha384-bsb3QmLtUiyaiHwtrL4YoAVI9yLsjyqxgoAsk4Zd+ass9rSK1WWRiCDSu/hm8QRp /languages/css.js
sha384-0XGvxIU7Oq1DQMMBr1ORiozzBq3KpZPE/74mJysWRBAop1dZ9Ioq/qRWe8u30Ded /languages/css.min.js
sha384-hV7ok3wrc7DrjvcAtn3jI6KlZtpbm+hC4HXrOyRjrl65HjGtTJ5ixGiMSpJRDiDq /languages/http.js
sha384-X50fiL5mByDvJRwn0hkUXIEttF5t8hlEFSPUMq42KoryxgI4niflBsviuhahhWJf /languages/http.min.js
sha384-yxv7Fv9ToggiLsR67t98hV5ZRup6XX6xL1Rkbi/cGV5J8y7fosCi9POqlBkiBWFg /languages/javascript.js
sha384-tPOrIubtDHoQU7Rqw0o88ilthGO0/4xEZGB47XrQKWhrc1/SchwsDx+AP74u4nk0 /languages/javascript.min.js
sha384-pUlqdjoNePvHvdi7GVKJJnh/P2T3EvXXodl5j0JtTkbNC4DRH7gwGbcHFa84bFOP /languages/json.js
sha384-3C+cPClJZgjKFYAb0bh35D7im2jasLzgk9eRix3t1c5pk1+x6b+bHghWcdrKwIo3 /languages/json.min.js
sha384-Sk9XW/OOutdl6KS1M9Wson0imuqr0LkpoTRDHi5QFH4MWe0aViI5d86BOVkh8Ds0 /languages/markdown.js
sha384-Rv26WbhHH4MDPzeExq4ECmZUYF942tlfVhqA91Drw1P+Ey55KjihLF9RJENxjWr1 /languages/markdown.min.js
sha384-DQroZ14Erpo7ay5JoNeZEUe41UI7w0Jra2nABCsZVG/EJVO5Zfb2sS1fEt/YGGPe /languages/php-template.js
sha384-LIzUVMUAZRreWHTENKQ/wXuNK17VO4xPf+kR1a0aBKvM3S7vsedCcFJZC7N7vdDt /languages/php-template.min.js
sha384-e5MJZgawCv4c+BexmFUMVQU6dLcIOXdieG/a1FPCIgnlGfBIEUUcFMMo+UrKMOtN /languages/scss.js
sha384-BYdYy4D3IX6eNNlKqsviUjxC6EqavvNwCVDMzmie3QXyArWdCQf+VvvFo4ciaNaW /languages/scss.min.js
sha384-2sXmcW3eKeNDWiLtuq9NgFJC4NsLBN/fDTzZevmcgBrSERv6iO/k+c7r9T09Fb8J /languages/sql.js
sha384-jrnLoVn13sB+/dTfoAYVPhg0tYGQzzuzSGP3WTk8OvKAY0hDejpUXFYYI3bohAyW /languages/sql.min.js
sha384-8v3YMaXFO9cmTNxsHWqwn9wJsV1jVO7rwx4huxqlEQpT/P2tuDbtm+Hs0EdYqu0a /languages/typescript.js
sha384-df1w1nJ43GNwmgbSCrT8YFIYyqFAm+lzj+b6ofuziX8Cfdg9QHFwbORDgAaj//wi /languages/typescript.min.js
sha384-4xzSHNAQ8Yq7V6Bai8x3LU+yqpE07chJFxv1VVhz6XeQJ5r378LP86IeJC2bw0+S /highlight.js
sha384-rL9BNE9qZwxPfTAj3n3jY/wbUkblpvaiqirU+GVz4T3GXlbq3uUP1f0J2Y6YZezD /highlight.min.js
```

