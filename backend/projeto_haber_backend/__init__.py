import pymysql

# Use PyMySQL as a drop-in replacement for MySQLdb (mysqlclient)
# This avoids the need to compile mysqlclient on Windows
pymysql.install_as_MySQLdb()

