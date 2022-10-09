'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
    })
    await queryInterface.createTable('restaurantes', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      nome:{
          type: Sequelize.STRING,
          allowNull: false
      },
      endereco: {
          type: Sequelize.STRING, 
          allowNull: false
      },
      longitude: {
          type: Sequelize.FLOAT(8, 3),
          allowNull: false
      },
      latitude: {
          type: Sequelize.FLOAT(8, 5),
          allowNull: false
      },
      mesas_total: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      hora_abertura: {
          type: Sequelize.TIME,
          allowNull: false
      },
      hora_fechar: {
          type: Sequelize.TIME,
          allowNull: false,
      }
    })
    await queryInterface.createTable('pratos', {
      id: {
          type: Sequelize.STRING, 
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
      },
      preco: {
          type: Sequelize.FLOAT(4,2),
          allow: false
      },
      ingredientes: {
          type: Sequelize.JSON,
          allowNull: true
      },
      descricao: {
          type: Sequelize.STRING,
          allowNull: false
      },
      disponivel: {
          type: Sequelize.BOOLEAN,
          allowNull: false
      },
      tempo_preparo: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      acompanhamentos: {
          type: Sequelize.JSON,
          allowNull: true
      },
      RestauranteId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'restaurantes',
          key: 'id'
        }
      }
    })
    await queryInterface.createTable('mesas', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      num_mesa: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      RestauranteId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'restaurantes',
          key: 'id'
        }
      }
    })
    await queryInterface.createTable('pedidos', {
      num_pedido: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: Sequelize.UUIDV1,
          primaryKey: true
      },
      valor_pedido: {
          type: Sequelize.FLOAT(4, 2),
          allowNull: false
      },
      hora_pedido: {
          type: Sequelize.TIME,
          allowNull: false
      },
      horario_reservado: {
          type: Sequelize.DATE,
          allowNull: false
      },
      ativo: {
          type: Sequelize.BOOLEAN,
          allowNull: false
      },
      UsuarioId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id'
          }
      },
      MesaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mesas',
          key: 'id'
        }
      },
      RestauranteId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'restaurantes',
          key: 'id'
        }
      }
    })
    await queryInterface.createTable('pratos_pedidos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      quantidade: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      ingredientes_excluidos: {
          type: Sequelize.JSON,
          allowNull: true
      },
      preparar: {
          type: Sequelize.BOOLEAN,
          allowNull: false
      },
      PedidoNumPedido: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'pedidos',
          key: 'num_pedido'
        }
      },
      PratoId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'pratos',
          key: 'id'
        }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('pratos_pedidos')
    await queryInterface.dropTable('pedidos')
    await queryInterface.dropTable('mesas')
    await queryInterface.dropTable('pratos')
    await queryInterface.dropTable('restaurantes')
    await queryInterface.dropTable('usuarios')
  }
};
