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
    await queryInterface.addColumn('pedidos', 'observacao', {
      allowNull: true,
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('pratos_pedidos', 'observacao', {
      allowNull: true,
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('pedidos', 'observacao')
    await queryInterface.removeColumn('pratos_pedidos', 'observacao')
  }
};
