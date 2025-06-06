(defpackage #:firecrawl-lisp-client
  (:use #:cl)
  (:import-from #:dexador)
  (:import-from #:jonathan)
  (:import-from #:local-time)
  (:export #:main))

(in-package #:firecrawl-lisp-client)

(defconstant +firecrawl-api-key+ "FC_DUMMY_API_KEY"
  "Dummy API key for Firecrawl. Required by the API, though may not be validated for local instances.")

(defconstant +firecrawl-api-base-url+ "http://localhost:3002"
  "Base URL for the local Firecrawl API endpoint.")

(defun scrape-url (target-url)
  "Fetches content from the given URL using Firecrawl API and returns the scrape result data.
   TARGET-URL: The URL string to scrape.
   Returns the 'data' part of the JSON response as a Lisp data structure (alist/plist).
   Signals an error if the request fails or the API returns an error."
  (let* ((api-url (concatenate 'string +firecrawl-api-base-url+ "/v1/scrape"))
         (headers `(("Authorization" . ,(concatenate 'string "Bearer " +firecrawl-api-key+))
                     ("Content-Type" . "application/json")))
         (payload `(:object
                    ("url" . ,target-url)
                    ("onlyMainContent" . t)
                    ("formats" . #("markdown")))))
    (format t "Scraping URL: ~a~%" target-url)
    (handler-case
        (let* ((response-body (dex:post api-url
                                        :headers headers
                                        :content (jojo:to-json payload)
                                        :want-stream nil ; Get as string
                                        ))
               (parsed-json (jojo:parse response-body)))
          (if (and (assoc :success parsed-json)
                     (cdr (assoc :success parsed-json)))
              (cdr (assoc :data parsed-json))
              (error "Firecrawl API request failed or returned an error: ~a" parsed-json)))
      (error (e)
        (error "Failed to scrape URL ~a: ~a" target-url e)))))

(defun save-scrape-result-to-file (scrape-result prefix)
  "Saves the Firecrawl scrape result (Lisp data structure) as a JSON file.
   SCRAPE-RESULT: The Lisp data structure (alist/plist) representing the scraped data.
   PREFIX: The prefix for the output filename.
   Returns the name of the saved file or signals an error."
  (format t "~%--- Saving Scraped Content (JSON) ---~%")
  (let* ((json-string (jojo:to-json scrape-result :pretty t))
         (timestamp (local-time:format-timestring nil (local-time:now)
                                                  :format '((:year 4) (:month 2) (:day 2) "_" (:hour 2) (:min 2) (:sec 2))))
         (filename (format nil "~a_~a.json" prefix timestamp)))
    (handler-case
        (with-open-file (stream filename
                                :direction :output
                                :if-exists :supersede
                                :if-does-not-exist :create)
          (write-string json-string stream)
          filename)
      (error (e)
        (error "Failed to save JSON to file ~a: ~a" filename e)))))

(defun main ()
  "Main function to scrape a URL and save the result."
  (let ((target-url "https://news.yahoo.co.jp/")) ; Example URL
    (handler-case
        (let* ((scrape-result (scrape-url target-url))
               (saved-filename (save-scrape-result-to-file scrape-result "scraped_content_lisp")))
          (format t "Scraped data has been saved to: ~a~%" saved-filename)
          (format t "~%--- Process successful! ---~%"))
      (error (e)
        (format *error-output* "Error during processing: ~a~%" e)
        (uiop:quit 1))))) 

;; To run from command line or REPL:
;; (ql:quickload '(:dexador :jonathan :local-time :firecrawl-lisp-client))
;; (firecrawl-lisp-client:main)
;; Ensure this file is discoverable by ASDF or loaded directly.
;; For ASDF, you would create a .asd file.
;; Example firecrawl-lisp-client.asd:
;; (asdf:defsystem #:firecrawl-lisp-client
;;   :description "Lisp client for Firecrawl API"
;;   :author "Your Name"
;;   :license "Specify license"
;;   :depends-on (#:dexador #:jonathan #:local-time)
;;   :components ((:file "main")))
