ALL: poster.pdf

%.pdf: %.tex Makefile
	pdflatex --enable-write18 $< &&	pdflatex $< && pdflatex $<

clean:
	  rm -f *.aux	*.bbl	*.blg	*.log	*.fls *.fdb_latexmk *.gz poster.pdf

