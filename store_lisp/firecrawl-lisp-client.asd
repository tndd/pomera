(asdf:defsystem #:firecrawl-lisp-client
  :description "Lisp client for Firecrawl API, rewritten from Go."
  :author "Cascade AI Assistant"
  :license "MIT" ; Or your preferred license
  :version "0.1.0"
  :serial t
  :depends-on (#:dexador
               #:jonathan
               #:local-time)
  :components ((:file "main")))
