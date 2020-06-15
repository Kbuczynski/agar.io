export const isNearestEnemy = (newEnemyX, newEnemyY, nearestEnemyX, nearestEnemyY, playerX, playerY) => {
    if (
        Math.sqrt(Math.pow(newEnemyX - nearestEnemyX, 2) + Math.pow(newEnemyY - nearestEnemyY, 2)) 
        < 
        Math.sqrt(Math.pow(nearestEnemyX - playerX, 2) + Math.pow(nearestEnemyY - playerY, 2))
    ) return true;
    else return false;
}

export const distanceToEnemy = (enemyX, enemyY, playerX, playerY) =>
             Math.sqrt(Math.pow(enemyX - playerX, 2) + Math.pow(enemyY - playerY, 2));