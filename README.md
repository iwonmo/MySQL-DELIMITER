# MYSQL 定界符分析
通过硬编码的方式实现多语句分割并且支持定界符。

微信公众号：上下博客

```javascript
[
  [ 'SHOW', 4 ],          [ 'DATABASES', 14 ],  [ ';', 14 ],
  [ 'CREATE', 22 ],       [ 'USER', 27 ],       [ 'name', 32 ],
  [ 'IDENTIFIED', 43 ],   [ 'BY', 46 ],         [ "'", 47 ],
  [ 'aaa"=bbb,ccc', 60 ], [ "'", 60 ],          [ ';', 61 ],
  [ 'SET', 66 ],          [ 'PASSWORD', 75 ],   [ 'FOR', 79 ],
  [ 'name', 84 ],         [ '=', 84 ],          [ 'PASSWORD', 93 ],
  [ '(', 93 ],            [ "'", 94 ],          [ 'fdddfd', 101 ],
  [ "'", 101 ],           [ ')', 102 ],         [ ';', 103 ],
  [ 'SHOW', 109 ],        [ 'GRANTS', 116 ],    [ 'FOR', 120 ],
  [ 'name', 125 ],        [ ';', 125 ],         [ 'GRANT', 132 ],
  [ 'SELECT', 139 ],      [ 'ON', 142 ],        [ 'db_name.*', 152 ],
  [ 'TO', 155 ],          [ 'name', 160 ],      [ ';', 160 ],
  [ 'SHOW', 166 ],        [ 'DATABASES', 176 ], [ ';', 176 ],
  [ 'DELETE', 184 ],      [ 'FROM', 189 ],      [ 'tb_name', 197 ],
  [ 'WHERE', 203 ],       [ 'id', 206 ],        [ '=', 206 ],
  [ '3', 208 ],           [ ';', 208 ],         [ 'DELIMITER', 219 ],
  [ '$$', 222 ],          [ 'CREATE', 229 ],    [ 'PROCEDURE', 239 ],
  [ 'pro', 243 ],         [ '(', 243 ],         [ 'IN', 251 ],
  [ 'num', 255 ],         [ 'INT', 259 ],       [ ',', 259 ],
  [ 'OUT', 263 ],         [ 'total', 269 ],     [ 'INT', 273 ],
  [ ')', 273 ],           [ 'BEGIN', 284 ],     [ 'SELECT', 295 ],
  [ 'SUM', 299 ],         [ '(', 299 ],         [ 'score', 305 ],
  [ ')', 305 ],           [ 'INTO', 311 ],      [ 'total', 317 ],
  [ 'FROM', 322 ],        [ 'tb_name', 330 ],   [ 'WHERE', 336 ],
  [ 'id', 339 ],          [ '=', 339 ],         [ 'num', 343 ],
  [ ';', 343 ],           [ 'END', 351 ],       [ '$$', 354 ],
  [ 'DELIMITER', 364 ],   [ ';', 365 ],         [ 'DROP', 371 ],
  [ 'PROCEDURE', 381 ],   [ 'pro', 385 ],       [ ';', 385 ]
]
```
```mysql
SHOW DATABASES;
0 15
-----------------------

CREATE USER name IDENTIFIED BY 'aaa"=bbb,ccc';
15 62
-----------------------

SET PASSWORD FOR name=PASSWORD('fdddfd');
62 104
-----------------------

SHOW GRANTS FOR name;
104 126
-----------------------

GRANT SELECT ON db_name.* TO name;
126 161
-----------------------

SHOW DATABASES;
161 177
-----------------------

DELETE FROM tb_name WHERE id=3;
177 209
-----------------------

DELIMITER $$

209 223
-----------------------
CREATE PROCEDURE pro(
    IN num INT,OUT total INT)
    BEGIN
    SELECT SUM(score) INTO total FROM tb_name WHERE id=num;
    END$$

223 355
-----------------------
DELIMITER ;
355 366
-----------------------

DROP PROCEDURE pro;
366 386
-----------------------

[Done] exited with code=0 in 0.444 seconds
```