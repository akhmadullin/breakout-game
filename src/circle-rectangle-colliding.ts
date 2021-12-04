interface Circle {
    x: number;
    y: number;
    radius: number;
}

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

const circleRectangleColliding = (circle: Circle, rect: Rectangle): boolean => {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > rect.width / 2 + circle.radius) {
        return false;
    }
    if (distY > rect.height / 2 + circle.radius) {
        return false;
    }

    if (distX <= rect.width / 2) {
        return true;
    }
    if (distY <= rect.height / 2) {
        return true;
    }

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;

    return dx ** 2 + dy ** 2 <= circle.radius ** 2;
};

export default circleRectangleColliding;
