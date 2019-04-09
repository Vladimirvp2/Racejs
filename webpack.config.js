let path = require('path');

let conf = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist/'),
		filename: 'main.js',
		publicPath: 'dist/'
	},
	devServer: {
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			        {
			            test: /\.(png|jp(e*)g|svg)$/,  
			            use: [{
			                loader: 'url-loader',
			                options: { 
			                    limit: 8000, // Convert images < 8kb to base64 strings
			                    name: 'images/[hash]-[name].[ext]'
			                } 
			            }]
			        }			
		]
	}
};

module.exports = conf;