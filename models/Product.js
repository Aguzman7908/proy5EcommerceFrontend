// 1. IMPORTACIONES
const mongoose = require('mongoose')

// 2. SCHEMA
const productSchema = mongoose.Schema(
	{
		description: {
			type: String,
			default: "",
		},
		sku: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			
		},
        brand: {
        type: String,
        required:true,
        },
        image: {
            type: String, //base64
            
        },
		isActive: {
            type: Boolean,
            required: true,
        },
		
	},
	{
		timestamps: true, // Permite agregar la fecha en el que fue generado el documento.
	}
)

// 3. MODELO
const Product = mongoose.model('Products', productSchema)

// 4. EXPORTACIÓN
module.exports = Product
