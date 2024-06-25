/**
 * 依次顺序执行一系列任务
 * 所有任务全部完成后可以得到每个任务的执行结果
 * 需要返回两个方法，start用于启动任务，pause用于暂停任务
 * 每个任务具有原子性，即不可中断，只能两个任务之间中断
 */
function processTasks(tasks) {
    console.log(tasks, 1111)
    let isRunning = false;
    let result = []
    let index = 0;
    return {
        start() {
            return new Promise(async resolve => {
                console.log('task start')
                if (isRunning) {
                    return
                }
                isRunning = true;
                for (; index < tasks.length;) {
                    const task = tasks[index]
                    const r = await task();
                    index++;
                    result.push(r)
                    if (!isRunning) {
                        return
                    }
                }
                isRunning = false;
                resolve(result);
            })
        },
        pause() {
            console.log('task pause')
            isRunning = false;
        }
    }

}


// 使用示例  
const tasks = [
    () => new Promise(resolve => setTimeout(() => {
        let str = 'Task 1 completed'
        console.log(str)
        resolve(str)
    }, 1000)),
    () => new Promise(resolve => setTimeout(() => {
        let str = 'Task 2 completed'
        console.log(str)
        resolve(str)
    }, 1000)),
    () => new Promise(resolve => setTimeout(() => {
        let str = 'Task 3 completed'
        console.log(str)
        resolve(str)
    }, 1000)),
    // ...更多任务  
];


const runner = processTasks(tasks)
window.onload = () => {

    // 获取按钮元素
    var startBtn = document.getElementById('start');

    // 为按钮添加点击事件监听器
    startBtn.addEventListener('click', async function () {
        let res = await runner.start()
        console.log(res)
    });

    // 获取按钮元素
    var pauseBtn = document.getElementById('pause');

    // 为按钮添加点击事件监听器
    pauseBtn.addEventListener('click', function () {
        runner.pause()
    });
}


/**
 * 并发任务控制
 */

function timeout(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}


class SuperTask {
    constructor(maxCount = 2) {
        this.maxCount = maxCount;
        this.tasks = []
        this.res = []
        this.runningCount = 0;
    }

    add(task) {
        return new Promise((resolve, reject) => {
            this.tasks.push({
                task,
                resolve,
                reject
            })
            this._run()

        })
    }

    _run() {
        while (this.runningCount < this.maxCount && this.tasks.length) {
            let {
                task,
                resolve,
                reject
            } = this.tasks.shift()
            this.runningCount++
            task().then(resolve, reject).finally(() => {
                this.runningCount--
                this._run()
            })
        }
    }
}

let superTask = new SuperTask(2)

function addTask(time, name) {
    superTask.add(() => {
        return timeout(time)
    }).then(() => {
        console.log(`任务${name}完成`)
    })
}


addTask(10000, 1); //10000ms后输出:任务1完成
addTask(5000, 2); //5000ms后输出:任务2完成
addTask(3000, 3); //8000ms后输出:任务3完成
addTask(4000, 4); //12000ms后输出:任务4完成
addTask(5000, 5); //15000ms后输出:任务5完成