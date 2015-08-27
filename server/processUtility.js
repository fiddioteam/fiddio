process.isDev = function () { return process.env.NODE_ENV === 'development'; };
process.isProd = function () { return process.env.NODE_ENV === 'production'; };

process.verb = function () {
  if ( process.isDev() ) { console.log.apply( this, arguments ); }
};