.PHONY: all
all: ../MICSFT-WINDOWS-CP950.bin \
../big5_2003-b2u.bin \
../big5_2003-u2b.bin \
../cp950-b2u.bin \
../cp950-u2b.bin \
../hkscs2001-b2u.bin \
../hkscs2001-u2b.bin \
../hkscs2004-u11.bin \
../hkscs2004-u30.bin \
../hkscs2004-u41.bin \
../moz18-b2u-strict.bin \
../moz18-b2u.bin \
../moz18-u2b.bin \
../uao241-b2u.bin \
../uao241-u2b.bin \
../uao250-b2u.bin \
../uao250-u2b.bin \
../whatwg-b2u.bin \
../whatwg-u2b.bin

.PHONY: clean
clean:
	rm MICSFT-WINDOWS-CP950.txt \
	big5_2003-b2u.txt \
	big5_2003-u2b.txt \
	cp950-b2u.txt \
	cp950-u2b.txt \
	hkscs-2004-big5-iso.txt \
	hkscs2001-b2u.txt \
	hkscs2001-u2b.txt \
	hkscs2004-u11.txt \
	hkscs2004-u30.txt \
	hkscs2004-u41.txt \
	index-big5.txt \
	moz18-b2u-strict.txt \
	moz18-b2u.txt \
	moz18-u2b.txt \
	uao241-b2u.txt \
	uao241-u2b.txt \
	uao250-b2u.txt \
	uao250-u2b.txt

../MICSFT-WINDOWS-CP950.bin: MICSFT-WINDOWS-CP950.txt tablebuilder.js
	node ./tablebuilder.js MICSFT-WINDOWS-CP950.txt && mv MICSFT-WINDOWS-CP950.bin ../
../big5_2003-b2u.bin: big5_2003-b2u.txt tablebuilder.js
	node ./tablebuilder.js big5_2003-b2u.txt && mv big5_2003-b2u.bin ../
../big5_2003-u2b.bin: big5_2003-u2b.txt tablebuilder.js
	node ./tablebuilder.js big5_2003-u2b.txt && mv big5_2003-u2b.bin ../
../cp950-b2u.bin: cp950-b2u.txt tablebuilder.js
	node ./tablebuilder.js cp950-b2u.txt && mv cp950-b2u.bin ../
../cp950-u2b.bin: cp950-u2b.txt tablebuilder.js
	node ./tablebuilder.js cp950-u2b.txt && mv cp950-u2b.bin ../
../hkscs2001-b2u.bin: hkscs2001-b2u.txt tablebuilder.js
	node ./tablebuilder.js hkscs2001-b2u.txt && mv hkscs2001-b2u.bin ../
../hkscs2001-u2b.bin: hkscs2001-u2b.txt tablebuilder.js
	node ./tablebuilder.js hkscs2001-u2b.txt && mv hkscs2001-u2b.bin ../
../moz18-b2u-strict.bin: moz18-b2u-strict.txt tablebuilder.js
	node ./tablebuilder.js moz18-b2u-strict.txt && mv moz18-b2u-strict.bin ../
../moz18-b2u.bin: moz18-b2u.txt tablebuilder.js
	node ./tablebuilder.js moz18-b2u.txt && mv moz18-b2u.bin ../
../moz18-u2b.bin: moz18-u2b.txt tablebuilder.js
	node ./tablebuilder.js moz18-u2b.txt && mv moz18-u2b.bin ../
../uao241-b2u.bin: uao241-b2u.txt tablebuilder.js
	node ./tablebuilder.js uao241-b2u.txt && mv uao241-b2u.bin ../
../uao241-u2b.bin: uao241-u2b.txt tablebuilder.js
	node ./tablebuilder.js uao241-u2b.txt && mv uao241-u2b.bin ../
../uao250-b2u.bin: uao250-b2u.txt tablebuilder.js
	node ./tablebuilder.js uao250-b2u.txt && mv uao250-b2u.bin ../
../uao250-u2b.bin: uao250-u2b.txt tablebuilder.js
	node ./tablebuilder.js uao250-u2b.txt && mv uao250-u2b.bin ../

MICSFT-WINDOWS-CP950.txt:
	wget http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT -O MICSFT-WINDOWS-CP950.txt
big5_2003-b2u.txt:
	wget https://moztw.org/docs/big5/table/big5_2003-b2u.txt -O big5_2003-b2u.txt
big5_2003-u2b.txt:
	wget https://moztw.org/docs/big5/table/big5_2003-u2b.txt -O big5_2003-u2b.txt
cp950-b2u.txt:
	wget https://moztw.org/docs/big5/table/cp950-b2u.txt -O cp950-b2u.txt
cp950-u2b.txt:
	wget https://moztw.org/docs/big5/table/cp950-u2b.txt -O cp950-u2b.txt
hkscs2001-b2u.txt:
	wget https://moztw.org/docs/big5/table/hkscs2001-b2u.txt -O hkscs2001-b2u.txt
hkscs2001-u2b.txt:
	wget https://moztw.org/docs/big5/table/hkscs2001-u2b.txt -O hkscs2001-u2b.txt
moz18-b2u-strict.txt:
	wget https://moztw.org/docs/big5/table/moz18-b2u-strict.txt -O moz18-b2u-strict.txt
moz18-b2u.txt:
	wget https://moztw.org/docs/big5/table/moz18-b2u.txt -O moz18-b2u.txt
moz18-u2b.txt:
	wget https://moztw.org/docs/big5/table/moz18-u2b.txt -O moz18-u2b.txt
uao241-b2u.txt:
	wget https://moztw.org/docs/big5/table/uao241-b2u.txt -O uao241-b2u.txt
uao241-u2b.txt:
	wget https://moztw.org/docs/big5/table/uao241-u2b.txt -O uao241-u2b.txt
uao250-b2u.txt:
	wget https://moztw.org/docs/big5/table/uao250-b2u.txt -O uao250-b2u.txt
uao250-u2b.txt:
	wget https://moztw.org/docs/big5/table/uao250-u2b.txt -O uao250-u2b.txt

../hkscs2004-u11.bin: hkscs2004-u11.txt tablebuilder.js
	node ./tablebuilder.js hkscs2004-u11.txt && mv hkscs2004-u11.bin ../
../hkscs2004-u30.bin: hkscs2004-u30.txt tablebuilder.js
	node ./tablebuilder.js hkscs2004-u30.txt && mv hkscs2004-u30.bin ../
../hkscs2004-u41.bin: hkscs2004-u41.txt tablebuilder.js
	node ./tablebuilder.js hkscs2004-u41.txt && mv hkscs2004-u41.bin ../
hkscs2004-u11.txt hkscs2004-u30.txt hkscs2004-u41.txt: hkscs-2004-big5-iso.txt hkscs-2004-process.js
	node ./hkscs-2004-process.js
hkscs-2004-big5-iso.txt:
	wget https://web.archive.org/web/20070705200733id_/http://www.info.gov.hk:80/digital21/eng/hkscs/download/hkscs-2004-big5-iso.txt -O hkscs-2004-big5-iso.txt

../whatwg-b2u.bin ../whatwg-u2b.bin: index-big5.txt whatwg-encoding.js
	node ./whatwg-encoding.js && \
	mv whatwg-u2b.bin ../ && \
	mv whatwg-b2u.bin ../
index-big5.txt:
	wget https://encoding.spec.whatwg.org/index-big5.txt -O index-big5.txt
