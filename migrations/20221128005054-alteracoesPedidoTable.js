'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.removeColumn('pedidos', 'hora_pedido')
    await queryInterface.changeColumn('pedidos', 'horario_reservado', {
      type: Sequelize.TIME,
      allowNull: false
    })
    await queryInterface.addColumn('pedidos', 'data_reservada', {
      type: Sequelize.DATE,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('pedidos', 'data_reservada')
    await queryInterface.changeColumn('pedidos', 'horario_reservado', {
      type: Sequelize.DATE,
      allowNull: false
    })
    await queryInterface.addColumn('pedidos', 'hora_pedido', {
      type: Sequelize.TIME,
      allowNull: false
    })
  }
};
