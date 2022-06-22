const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // Entry nos permite decir el punto de entrada de nuestra aplicación
    entry: "./src/index.js",
    // Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
    output: {
      // path es donde estará la carpeta donde se guardará los archivos
      // Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
      path: path.resolve(__dirname, "dist"),
      // filename le pone el nombre al archivo final
      filename: '[name].[contenthash].js',
      //output de las fuentes 
      assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        // Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea
        extensions: [".js"],
        alias: {
          '@utils': path.resolve(__dirname, 'src/utils/'),
          '@templates': path.resolve(__dirname, 'src/templates/'),
          '@styles': path.resolve(__dirname, 'src/styles/'),
          '@images': path.resolve(__dirname, 'src/assets/images/')
        }
      },
      module: {
        // REGLAS PARA TRABAJAR CON WEBPACK
          rules: [
            {
              test: /\.m?js$/,// LEE LOS ARCHIVOS CON EXTENSION .JS
          exclude: /node_modules/, // IGNORA LOS MODULOS DE LA CARPETA
          use: {
            loader: 'babel-loader'
              }
            },
            {
              test: /\.css|.styl$/i,
              use: [MiniCssExtractPlugin.loader,
                'css-loader',
                'stylus-loader'],
            },
            {
              test: /\.png/,
              type: 'asset/resource'
            },
            {
              test: /\.(woff|woff2)$/,
              use: {
                loader: "url-loader",
                options: {
              // limit => limite de tamaño // O LE PASAMOS UN NUMERO, Habilita o deshabilita la transformación de archivos en base64.
              limit: 10000,
              // Mimetype => tipo de dato nos permite determinar el tipo de archivo que será enlazado o cargado
						// Los MIME Types (Multipurpose Internet Mail Extensions), son la manera standard de mandar contenido a través de la red.
              mimetype: "application/font-woff",
              // name => nombre de salida EL NOMBRE INICIAL DEL PROYECTO + SU EXTENSIÓN, PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria ubuntu-regularhola.woff
              name: "[name].[contenthash].[ext]",
              // outputPath => donde se va a guardar en la carpeta final
              outputPath: "./assets/fonts/",
              publicPath: "../assets/fonts/",
              esModule: false,
              },
            }
          }
        ]
      },
      plugins: [ 
        // CONFIGURACIÓN DEL PLUGIN
        new HtmlWebpackPlugin({
          inject: true, // INYECTA EL BUNDLE AL TEMPLATE HTML
          template: './public/index.html', // LA RUTA AL TEMPLATE HTML
          filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
        }),
        new MiniCssExtractPlugin({
          filename: 'assets/[name].[contenthash].css'
        }
        ),
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, "src", "assets/images"), //que recurso (archivo o directorio) deseamos copiar al directorio final
              to: "assets/images" //en que ruta dentro de la carpeta final terminara los recursos
            }
          ]
        }),
        new Dotenv(),
      ],
      optimization: {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(),
          new TerserPlugin(),
          new CleanWebpackPlugin(),
        ]
      }
}