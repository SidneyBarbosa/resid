const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Acao = sequelize.define('Acao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_acao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY, // Usamos DATEONLY para não se preocupar com a hora
    allowNull: false,
  },
  profile_id: { // Chave estrangeira
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'Acoes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Acao;