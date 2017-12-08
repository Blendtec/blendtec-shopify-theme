branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
if [ "$branch" = "master" ]
then
    theme watch
else
    theme watch -c "config-develop.yml"
fi