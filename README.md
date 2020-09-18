backend code v1.0
it uses ipfs-http-client for adding and retreiving files from ipfs and since .get method takes 10-20 sec to get a file
my aim is to reduce the time so I will be experimenting with fleek.
backend code v2.0
fleek worked wonders and the time to get the data from ipfs was reduced from 10 to 15 or even 20 sometimes to at max 4 seconds. The first .get took 10 second after that the time got down to < 4 sec.
the upload time is also significantly faster.
but will have to change the structure of my music smart contract